import { Component, OnInit ,ElementRef,HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService,UserProfile } from '../../../services/authService';
import { CookieService } from 'ngx-cookie-service';

interface SearchItem {
  title: string;
  category: string;
  action: () => void;
  keywords: string; // The error says this is required
  icon?: string;    // Optional icon
}
interface SearchResult {
  title: string;
  category: string;
  action: () => void;
  icon?: string;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})

export class Header implements OnInit {
 notifications: any[] = [];
  currentSection: string = 'account';
  showProfile = false;
  showHelp = false;
  showNotifications = false;
  showSettings = false;
  showShortcutsModal: boolean = false;
  showSuccessToast: boolean = false;
  showFeedbackModal: boolean = false;
  feedbackText: string = '';
  oldPassword = '';
  newPassword = '';
  newEmail = '';
  language = 'English';
  timezone = 'GMT+3';
cookiesAccepted: boolean = false;
  settingsResponse = '';
  user: UserProfile | null = null;

isDark = false;
translations: any = {
  English: {
    welcome: 'Welcome',
    settings: 'Settings',
    logout: 'Logout',
    account: 'Account Settings',
    password: 'Change Password',
    email: 'Update Email',
    security: 'Security Settings',
    privacy: 'Privacy (Cookies)',
    preferences: 'Preferences',
    save: 'Save',
    searchPlaceholder: 'Search tasks, notes, meetings...',
    oldPasswordLabel: 'Old Password',
    newPasswordLabel: 'New Password',
    updateBtn: 'Update Password',
    newEmailLabel: 'New Email',
    saveBtn: 'Save',
    langLabel: 'Select Language',
    timezoneLabel: 'Timezone',
    themeLabel: 'Themes',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    emailLabel: 'Email',
    usernameLabel: 'Username',
    privacyDesc: 'Manage how we store data on your device.',
    cookieLabel: 'Personalization Cookies',
    cookieDesc: 'Remembers your theme, language, and timezone.',
    dept: 'Department',
    reports: 'Reports to',
    phone: 'Phone',
    org: 'Organization',
    loc: 'Location',
    serverLabel: 'Server',
    reminder: 'Reminder 1',
    systemUpdate: 'System Update',
    helpArticles: 'Help Articles',
    support: 'Support',
    feedback: 'Feedback',
    shortcuts: 'Keyboard Shortcuts',
    securityInfo: 'Two-factor authentication, sessions, etc.',
    res_pass_success: 'Password changed successfully',
    res_email_success: 'Account updated successfully',
    res_pref_success: 'Preferences updated',
    res_error: 'An error occurred',
    aboutDevoTitle: 'About DEVO',
    unifiedHub: 'Your Unified Productivity Hub',
    exploreDevo: 'Explore DEVO',
    fastFeat: 'Fast: Optimized for instant task updates.',
    secureFeat: 'Secure: Your data and notes are private.',
    globalFeat: 'Global: Multi-language support for all users.',
    shareThoughts: 'Share your thoughts',
    requiredNote: 'Required fields are marked with an asterisk',
    feedbackPlaceholder: 'Your feedback here...',
    cancelBtn: 'Cancel',
    sendFeedbackBtn: 'Send feedback',
    feedbackSuccess: 'Feedback sent successfully!',
    shortcutsTitle: 'Keyboard Shortcuts',
    shortcutNotify: 'Toggle Notifications',
    shortcutSettings: 'Toggle Settings',
    shortcutHelp: 'Toggle Help',
    shortcutGuide: 'Show This Guide',
    gotIt: 'Got it',
    description: `DEVO is an all-in-one productivity platform designed to simplify the way individuals and teams organize their work. It combines task management, team collaboration, meetings, chat, and note-taking into a single, unified ecosystem—eliminating the need to switch between multiple tools. DEVO focuses on efficiency and real-time collaboration, allowing users to manage teams, assign and track tasks, communicate instantly, and organize notes in one seamless workspace. Real-time synchronization ensures all updates are reflected immediately, keeping everyone aligned and productive. With a clean, intuitive interface, persistent data storage, customizable themes, and a secure architecture.`
  },
  Arabic: {
    welcome: 'مرحباً',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    account: 'إعدادات الحساب',
    password: 'تغيير كلمة المرور',
    email: 'تحديث البريد الإلكتروني',
    security: 'إعدادات الأمان',
    privacy: 'الخصوصية (ملفات الارتباط)',
    preferences: 'التفضيلات',
    save: 'حفظ التعديلات',
    searchPlaceholder: 'البحث عن المهام، الملاحظات...',
    oldPasswordLabel: 'كلمة المرور القديمة',
    newPasswordLabel: 'كلمة المرور الجديدة',
    updateBtn: 'تحديث كلمة المرور',
    newEmailLabel: 'البريد الإلكتروني الجديد',
    saveBtn: 'حفظ',
    langLabel: 'اختر اللغة',
    timezoneLabel: 'المنطقة الزمنية',
    themeLabel: 'المظهر',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',
    emailLabel: 'البريد الإلكتروني',
    usernameLabel: 'اسم المستخدم',
    privacyDesc: 'إدارة كيفية تخزين البيانات على جهازك.',
    cookieLabel: 'ملفات تعريف الارتباط الشخصية',
    cookieDesc: 'تذكر المظهر واللغة والمنطقة الزمنية.',
    dept: 'القسم',
    reports: 'مسؤول عنه',
    phone: 'الهاتف',
    org: 'المؤسسة',
    loc: 'الموقع',
    serverLabel: 'الخادم',
    reminder: 'تذكير ١',
    systemUpdate: 'تحديث النظام',
    helpArticles: 'مقالات المساعدة',
    support: 'الدعم الفني',
    feedback: 'الملاحظات',
    shortcuts: 'اختصارات لوحة المفاتيح',
    securityInfo: 'المصادقة الثنائية، الجلسات، إلخ.',
    res_pass_success: 'تم تغيير كلمة المرور بنجاح',
    res_email_success: 'تم تحديث الحساب بنجاح',
    res_pref_success: 'تم حفظ التفضيلات',
    res_error: 'حدث خطأ ما',
    aboutDevoTitle: 'حول DEVO',
    unifiedHub: 'مركز الإنتاجية الموحد الخاص بك',
    exploreDevo: 'استكشف DEVO',
    fastFeat: 'سريع: محسن لتحديث المهام فوراً.',
    secureFeat: 'آمن: بياناتك وملاحظاتك خاصة.',
    globalFeat: 'عالمي: دعم لغات متعددة لجميع المستخدمين.',
    shareThoughts: 'شاركنا أفكارك',
    requiredNote: 'الحقول المطلوبة مشار إليها بعلامة',
    feedbackPlaceholder: 'اكتب ملاحظاتك هنا...',
    cancelBtn: 'إلغاء',
    sendFeedbackBtn: 'إرسال الملاحظات',
    feedbackSuccess: 'تم إرسال ملاحظاتك بنجاح!',
    shortcutsTitle: 'اختصارات لوحة المفاتيح',
    shortcutNotify: 'تبديل التنبيهات',
    shortcutSettings: 'تبديل الإعدادات',
    shortcutHelp: 'تبديل المساعدة',
    shortcutGuide: 'إظهار هذا الدليل',
    gotIt: 'فهمت',
    description: `ديفو (DEVO) هي منصة إنتاجية متكاملة مصممة لتبسيط الطريقة التي ينظم بها الأفراد والفرق أعمالهم. فهي تجمع بين إدارة المهام، والتعاون الجماعي، والاجتماعات، والدردشة، وتدوين الملاحظات في نظام بيئي واحد وموحد - مما يلغي الحاجة إلى التنقل بين أدوات متعددة. يركز ديفو على الكفاءة والتعاون في الوقت الفعلي، مما يسمح للمستخدمين بإدارة الفرق، وتعيين المهام وتتبعها، والتواصل الفوري، وتنظيم الملاحظات في مساحة عمل واحدة سلسة. يضمن التزامن في الوقت الفعلي انعكاس جميع التحديثات على الفور، مما يحافظ على توافق الجميع وإنتاجيتهم. مع واجهة نظيفة وبسيطة، وتخزين مستمر للبيانات، وسمات قابلة للتخصيص، وبنية آمنة.`
  }
};
showSettingsModal: boolean = false;
text = this.translations['English']; // Default text
  constructor(
    private router: Router,
    public authService: AuthService,
    private http: HttpClient,
    private cookieService: CookieService,
    private elRef: ElementRef
  ) {}

  tasks = [
  { id: 1, title: 'Tasks', type: 'Task' },
  { id: 2, title: 'Meeting', type: 'Meeting' },
  { id: 3, title: 'Notes', type: 'Note' },
  { id: 101, title: 'Calendar', type: 'Calendar' },
  // New To-Do Items
  { id: 201, title: 'To-Do', type: 'To-Do' }
];
filteredResults: SearchItem[] = [];
searchTerm: string = '';
// Inside your Component class
allSearchableItems: SearchItem[] = [];
initializeSearch() {
  this.allSearchableItems = [
    // --- ACTIONS / SETTINGS ---
    { title: this.text.account, category: 'Settings', keywords: 'profile user account', action: () => this.openSection('account') },
    { title: this.text.password, category: 'Settings', keywords: 'password security', action: () => this.openSection('password') },
    { title: this.text.helpArticles, category: 'Help', keywords: 'help support about', action: () => this.openHelpPopup() },
    { title: this.text.shortcuts, category: 'Help', keywords: 'keyboard keys shortcuts', action: () => this.showShortcuts() },
    { title: this.text.logout, category: 'System', keywords: 'exit logout signoff', action: () => this.logout() },
    // --- DATA (You would typically fetch these from your service) ---
    { title: 'Project Launch Note', category: 'Notes', keywords: 'note project', action: () => this.goToNote(1) },
    { title: 'Meeting with Client', category: 'Calendar', keywords: 'meeting event', action: () => this.goToCalendar(5) },
    { title: 'Buy Groceries', category: 'To-Do', keywords: 'task todo list', action: () => this.goToTask(10) },
    { title:'profile',category:'user',keywords:'user profile account',action:()=>this.openProfile()},
    {title:'notifications',category:'alerts',keywords:'notifications alerts messages',action:()=>this.openNotifications()}
  ];
}

getSearchableItems(): SearchItem[] {
  const items: SearchItem[] = [
    // --- STATIC ACTIONS ---
    { title: this.text.account, category: 'Settings', keywords: 'profile user account', icon: '⚙️', action: () => this.openSection('account') },
    { title: this.text.password, category: 'Settings', keywords: 'password security', icon: '🔑', action: () => this.openSection('password') },
    { title: this.text.helpArticles, category: 'Help', keywords: 'help support about', icon: '📚', action: () => this.openHelpPopup() },
    { title: this.text.shortcuts, category: 'Help', keywords: 'keyboard keys shortcuts', icon: '⌨️', action: () => this.showShortcuts() },
    { title: this.text.logout, category: 'System', keywords: 'exit logout signoff', icon: '🚪', action: () => this.logout() },
    { title:'profile',category:'user',keywords:'user profile account',icon:'👤',action:()=>this.openProfile()},
    {title:'notifications',category:'alerts',keywords:'notifications alerts messages',icon:'🔔',action:()=>this.openNotifications()},
    { 
    title: 'My List', 
    category: 'Dashboard', 
    keywords: 'todo my list home', 
    icon: '📋', 
    action: () => this.goToMyList() 
  },
  { 
    title: 'Team Dashboard', 
    category: 'Teams', 
    keywords: 'teams collaboration group', 
    icon: '👥', 
    action: () => this.goToTeams() 
  }
  ];

  // --- DYNAMIC DATA ---
  // Mapping the tasks array which now has IDs
  this.tasks.forEach(item => {
  items.push({
    title: item.title,
    category: item.type,
    keywords: item.title.toLowerCase(),
    icon: item.type === 'Task' ? '✅' : '📅',
    action: () => {
      // THIS IS WHERE THE NAV HAPPENS
      if (item.type === 'Note') this.goToNote(item.id);
      if (item.type === 'Calendar') this.goToCalendar(item.id);
      if (item.type === 'Task') this.goToTask(item.id);

    }
  });
});
  return items;
}
ngOnInit(): void {
  // 1. Initialize the search data index
  this.initializeSearch(); 
// header.ts -> inside ngOnInit subscription
this.authService.currentUser$.subscribe({
  next: (profile: any) => {
    if (profile) {
      this.user = {
        ...profile,
        // 1. Fix the Name (Ensure it's not an empty string)
        fullName: profile.fullName || 'Hala Eid', 
        
        // 2. Fix the Title
        jobTitle: profile.jobTitle || 'Developer',

        // 3. Map Backend JSON keys to Frontend UI keys
        department: profile.departmentId, // Backend has 'departmentId'
        reportTo: profile.reportsTo,      // Backend has 'reportsTo'
        
        // 4. Map the rest exactly
        phoneNumber: profile.phoneNumber,
        organization: profile.organization,
        location: profile.location,
        profilePhotoUrl: profile.profilePhoto || '/pfp.jpg'
      };
    }
  }
});
  // 3. Load theme, language, and notifications
  let savedTheme = this.cookieService.get('theme') === 'dark' ? 'dark' : 'light';
  this.setTheme(savedTheme);

  this.language = this.cookieService.get('language') || 'English';
  this.changeLanguage(this.language as 'English' | 'Arabic');

  this.authService.notifications$.subscribe(data => {
    this.notifications = data;
  });
}
toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    // If you implemented the 'mark as read' logic in AuthService:
    if (this.showNotifications) {
      this.authService.markAllAsRead();
    }
  }
onSearch(event: any) {
  const query = this.searchTerm.toLowerCase().trim();
  
  if (!query) {
    this.filteredResults = [];
    return;
  }

  // Use the helper to get all items (Settings + Dynamic Data)
  const itemsToFilter = this.getSearchableItems();

  this.filteredResults = itemsToFilter.filter(item =>
    item.title.toLowerCase().includes(query) || 
    item.keywords.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );
}
  selectSettingsSection(section: string) {
  this.currentSection = section;
  this.showSettingsModal = true; 
  this.searchTerm = '';     
  this.filteredResults = [];
}
  // --- Navigation Methods ---

  // --- Fixed Navigation Methods ---
goToNote(id: number | string) {
  console.log('Navigating to note ID:', id);
  // This matches: /dashboard/notes/3
  this.router.navigate(['/dashboard', 'notes', id.toString()]); 
}

goToCalendar(id: number | string) {
  console.log('Navigating to calendar ID:', id);
  // This matches: /dashboard/calendar/101
  this.router.navigate(['/dashboard', 'calendar', id.toString()]);
}

goToTask(id: number | string) {
  console.log('Navigating to tasks');
  // Since your route for tasks doesn't have an :id, navigate to the base
  this.router.navigate(['/dashboard', 'tasks']);
}
// header.ts

goToMyList() {
  console.log('Navigating to My List');
  // Matches: { path: 'dashboard', children: [ { path: 'my-list' } ] }
  this.router.navigate(['/dashboard/my-list']);
}

goToTeams() {
  console.log('Navigating to Team Dashboard');
  // Matches: { path: 'dashboard', children: [ { path: 'team-dashboard' } ] }
  this.router.navigate(['/dashboard/team-dashboard']);
}
  clearSearch() {
  this.searchTerm = '';
  this.filteredResults = [];
}

  openSection(section: string) {
  // 1. Set the specific tab (account, password, etc.)
  this.currentSection = section;

  // 2. Open the modal/dropdown container
  this.showSettings = true;

  // 3. Close other UI elements so they don't overlap
  this.showNotifications = false;
  this.showHelp = false;
  this.showProfile = false;
  this.searchTerm = '';
  this.filteredResults = [];

  console.log(`Mapsd to Settings: ${section}`);
}
  // --- Modal Toggle Methods ---
  openHelpPopup() {
    this.showHelpPopup = true; // This fixes the 'Did you mean closeHelpPopup?' error
    this.showHelp = false;      // Closes the small dropdown if it's open
  }
openProfile() {
  this.showProfile = true;      // Open the side panel/modal
  // Close everything else
  this.showSettings = false;
  this.showNotifications = false;
  this.showHelp = false;
  this.searchTerm = '';         // Clear search
  this.filteredResults = [];    // Hide results
}
 
openNotifications() {
  this.showNotifications = true; // Open the notification dropdown/modal
  // Close everything else
  this.showSettings = false;
  this.showHelp = false;
  this.showProfile = false;
  // Reset search
  this.searchTerm = '';
  this.filteredResults = [];
  
  console.log("Notifications panel opened via search");
}
  handleResultClick(item: SearchItem) {
    item.action();
    this.searchTerm = '';
    this.filteredResults = [];
  }
executeResult(item: SearchItem) {
  item.action();         // This executes the logic defined in getSearchableItems()
  this.searchTerm = '';  // Closes the search dropdown
  this.filteredResults = [];
}

setCookiesConsent() {
  this.cookieService.set('cookiesAccepted', this.cookiesAccepted.toString(), 365, '/');
}

  get userInitials(): string {
    if (!this.user?.fullName) return '';
    const parts = this.user.fullName.split(' ');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
    this.showHelp = this.showNotifications = this.showSettings = false;
  }

  toggleHelp() {
    this.showHelp = !this.showHelp;
    this.showProfile = this.showNotifications = this.showSettings = false;
    this.showNotifications = false;
  }


  toggleSettings() {
    this.showSettings = !this.showSettings;
    this.showProfile = this.showHelp = this.showNotifications = false;
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changePassword() {
  // Check for userId instead of id
  if (!this.user?.userId) {
    console.error("User ID is missing. Current user object:", this.user);
    this.settingsResponse = "Error: User session not found.";
    return;
  }

  const body = {
    userId: Number(this.user.userId), // Send as 'userId'
    oldPassword: this.oldPassword,
    newPassword: this.newPassword
  };

  // Note: Route is lowercase 'users' in your [Route("api/users")]
  this.http.post('http://localhost:5142/api/Users/change-password', body).subscribe({
    next: () => {
      this.settingsResponse = this.text.res_pass_success;
      this.oldPassword = ''; 
      this.newPassword = '';
      this.autoHideMessage();
    },
    error: (err) => {
      console.error("400 Error:", err.error);
      this.settingsResponse = err.error?.message || this.text.res_error;
      this.autoHideMessage();
    }
  });
}

  updateEmail() {
    const body = {
      userId: this.user?.userId,
      email: this.newEmail,
      userName: this.user?.userName ?? this.user?.fullName
    };

    this.http.put('http://localhost:5142/api/Users/update-account', body).subscribe({
      next: () => {
      this.settingsResponse = this.text.res_email_success;
      this.autoHideMessage();
    },
    error: () => {
      this.settingsResponse = this.text.res_error;
      this.autoHideMessage();
    }
  });
}
// Fix the updatePreferences to also hide the message
updatePreferences() {
  this.cookieService.set('language', this.language, 30, '/');
  this.cookieService.set('timezone', this.timezone, 30, '/');

  const body = { userId: this.user?.userId, language: this.language, timeZone: this.timezone };

  this.http.post('http://localhost:5142/api/Users/update-preferences', body).subscribe({
   next: () => {
      this.settingsResponse = this.text.res_pref_success;
      this.autoHideMessage();
    },
    error: () => {
      this.settingsResponse = this.text.res_error;
      this.autoHideMessage();
    }
  });
}
  autoHideMessage() {
  setTimeout(() => {
    this.settingsResponse = '';
  }, 3000); // 3000ms = 3 seconds
}

changeLanguage(lang: 'English' | 'Arabic') {
  this.language = lang;
  this.cookieService.set('language', lang, 30, '/');
  
  // Update the text dictionary immediately
  this.text = this.translations[lang];
  this.webDescription = this.text.description;

  // Re-run search initialization so keywords in search are updated to new language
  this.initializeSearch();
}
handleImageError(event: any) {
  // Points to the root where the public folder contents are served
  event.target.src = '/pfp.jpg'; 
}
// Add this inside the Header class
onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', String(this.user?.userId || ''));
    this.http.post('http://localhost:5142/api/Users/upload-pfp', formData).subscribe({
      next: (res: any) => {
        if (this.user) {
          this.user.profilePhotoUrl = res.url; 
          this.settingsResponse = this.language === 'English' ? 'Photo updated!' : 'تم تحديث الصورة';
          this.autoHideMessage();
        }
      },
      error: (err) => {
        console.error("UPLOAD ERROR", err);
        this.settingsResponse = this.language === 'English' ? 'Upload failed' : 'فشل الرفع';
        this.autoHideMessage();
      }
    });
  }
}

showHelpPopup: boolean = false;

webDescription: string = `
DEVO is an all-in-one productivity platform designed to simplify the way individuals and teams organize their work. It combines task management, team collaboration, meetings, chat, and note-taking into a single, unified ecosystem—eliminating the need to switch between multiple tools.

DEVO focuses on efficiency and real-time collaboration, allowing users to manage teams, assign and track tasks, communicate instantly, and organize notes in one seamless workspace. Real-time synchronization ensures all updates are reflected immediately, keeping everyone aligned and productive.

With a clean, intuitive interface, persistent data storage, customizable themes, and a secure architecture.`;

openHelpArticles() {
  this.showHelp = false; // Close the dropdown menu
  this.showHelpPopup = true; // Open the big popup
}

closeHelpPopup() {
  this.showHelpPopup = false;
}

  // 1. Logic for Contact Support
  contactSupport() {
    const email = 'support@devo.com';
    const subject = 'Support Request';
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  }

  // 2. Logic for Feedback
 sendFeedback() {
  this.showHelp = false; // Close dropdown
  this.showFeedbackModal = true; // Open the new modal
}
closeFeedbackModal() {
  this.showFeedbackModal = false;
  this.feedbackText = ''; // Clear text on close
}

submitFeedback() {
  if (this.feedbackText.trim()) {
    console.log("Feedback sent:", this.feedbackText);
    // 1. Hide the feedback modal
    this.showFeedbackModal = false;
    // 2. Show the success message
    this.showSuccessToast = true;
    // 3. Clear the text
    this.feedbackText = '';
    // 4. Automatically hide the toast after 3 seconds
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 3000);
  }
}
@HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
  // Check if user is typing in an input or textarea (to avoid triggering shortcuts while typing)
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return;
  }

  // Define your shortcuts here
  if (event.key === 'n' || event.key === 'N') {
    this.toggleNotifications();
  }
  if (event.key === 's' || event.key === 'S') {
    this.toggleSettings();
  }
  if (event.key === 'h' || event.key === 'H') {
    this.toggleHelp();
  }
  if (event.key === '?') {
    this.openShortcuts(); // Opens the shortcut guide
  }
}

@HostListener('document:click', ['$event'])
clickout(event: any) {
  if (!this.elRef.nativeElement.contains(event.target)) {
    this.clearSearch();
  }
}
openShortcuts() {
  this.showHelp = false; // Close the small dropdown
  this.showShortcutsModal = true;
}
showShortcuts() {
  this.showHelp = false; // Close the dropdown first
  this.showShortcutsModal = true;
}

closeShortcuts() {
  this.showShortcutsModal = false;
}
togglemenu() {
  this.authService.toggle();
}

setTheme(mode: string) {
  this.isDark = (mode === 'dark');
  
  if (this.isDark) {
    // This applies the class to the whole <body> so dashboard and sidebar change
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}


}
