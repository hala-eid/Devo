import { Injectable } from '@angular/core';

export interface User {
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USERS_KEY = 'app_users';

  constructor() {}

  // Get all users from localStorage
  getUsers(): User[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  // Save users to localStorage
  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Register a new user
  register(user: User): boolean {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === user.email)) {
      return false; // User already exists
    }
    
    users.push(user);
    this.saveUsers(users);
    return true;
  }

  // Login user
  login(email: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
  }

  // Check if user exists
  userExists(email: string): boolean {
    const users = this.getUsers();
    return users.some(u => u.email === email);
  }
}