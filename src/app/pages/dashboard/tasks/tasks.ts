import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskResponse } from './task.model';
import { TaskList } from './components/task-list/task-list';
import { CreateTask, CreateTaskDto } from './components/create-task/create-task';
import { TaskService } from '../../../services/TaskService';
import { RecentService } from '../../../services/RecentService';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskList, CreateTask],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class Tasks implements OnInit {
  currentUserEmail = ''; 
  role: 'manager' | 'employee' = 'manager';
  showCreateModal = false;
  tasks: Task[] = []; 

  constructor(
    private taskService: TaskService,
    private recentService: RecentService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  /**
   * 1. GET TASKS
   * Handlers the "Expected array but got object" error by checking 
   * for common .NET JSON wrappers ($values or .value)
   */
  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (res: any) => {
        console.log('DEBUG: Full Response Structure:', res);

        // Normalize response: handle arrays, .NET $values, or single objects
        let rawData: any[] = [];
        if (Array.isArray(res)) {
          rawData = res;
        } else if (res && res.$values && Array.isArray(res.$values)) {
          rawData = res.$values;
        } else if (res && res.value && Array.isArray(res.value)) {
          rawData = res.value;
        } else if (res && typeof res === 'object' && res.id) {
          rawData = [res]; // Wrap single object in array
        }

        this.tasks = rawData.map(task => ({
          ...task,
          // Map backend "InProgress" to frontend "in-progress"
          status: this.mapStatusFromBackend(task.status),
          isOverdue: this.checkIfOverdue(task.dueDate)
        }));
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.tasks = []; // Prevent NG0900 crash
      }
    });
  }

  /**
   * 2. CREATE TASK
   * Fixes the 400 Bad Request by ensuring the payload matches C# expectations
   */
  onTaskCreated(task: CreateTaskDto) {
    const payload = {
      title: task.title,
      description: task.description,
      tags: task.tags || '',
      status: task.status, // Ensure this matches your Backend Enum string
      assignedToEmail: task.assignedToEmail 
    };

    console.log('Sending Payload:', payload);

    this.taskService.createTask(payload).subscribe({
      next: (res: any) => {
        const newTask: Task = {
          ...res,
          status: this.mapStatusFromBackend(res.status),
          isOverdue: this.checkIfOverdue(res.dueDate)
        };
        
        // Update local list and UI
        this.tasks = [...this.tasks, newTask];
        this.recentService.add(`Created task: "${task.title}"`);
        this.showCreateModal = false;
      },
      error: (err) => {
        console.error('Failed to create task. Check Network tab for 400 details.', err);
      }
    });
  }

  /**
   * 3. UPDATE STATUS
   */
  updateTaskStatus(task: Task) {
    const backendStatus = this.mapStatusToBackend(task.status);
    
    this.taskService.updateTaskStatus(task.id!, backendStatus).subscribe({
      next: () => {
        this.recentService.add(`Updated status of "${task.title}" to ${backendStatus}`);
        this.loadTasks();
      },
      error: (err) => console.error('Failed to update status', err)
    });
  }

  /**
   * HELPER METHODS
   */
  checkIfOverdue(dueDate: any): boolean {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  }

  mapStatusToBackend(status: Task['status']): string {
    switch (status) {
      case 'todo': return 'Todo';
      case 'in-progress': return 'InProgress';
      case 'review': return 'Review';
      case 'done': return 'Done';
      default: return 'Todo';
    }
  }

  mapStatusFromBackend(status: string): Task['status'] {
    if (!status) return 'todo';
    switch (status.toLowerCase()) {
      case 'todo': return 'todo';
      case 'inprogress': return 'in-progress';
      case 'review': return 'review';
      case 'done': return 'done';
      default: return 'todo';
    }
  }

  openCreate() {
    this.showCreateModal = true;
  }
}