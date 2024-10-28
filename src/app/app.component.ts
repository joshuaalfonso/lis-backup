import { Component, OnInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from './auth/auth.service';
import { BehaviorSubject, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, ConfirmationService]

})
export class AppComponent implements OnInit {

  showSidebar = true;

  wideScreen = false;

  isNightMode = new BehaviorSubject<boolean>(false);

  // isNightMode: string | null;

  // isAuthenticated: boolean = false;

  sidebarVisible: boolean = false;

  constructor(private router: Router, private AuthService: AuthService){

    router.events.subscribe(
      (val)=>{
        if(val instanceof NavigationEnd) {
          if(val.url == '/login' || val.url == '/unauthorized') {
            this.showSidebar = false;
          }
          else {
            this.showSidebar = true
          }
        }
      }
    )
    
  }

  ngOnInit(): void {
    this.AuthService.autoLogin();
  }

  onToggleNightmode() {

    this.isNightMode.next(!this.isNightMode.value);

    document.documentElement.setAttribute('data-theme', this.isNightMode.value ? 'dark' : '');
  }

  onToggleSideBar() {
    this.showSidebar = !this.showSidebar;
  }

  onToggleWideScreen() {
    this.wideScreen = !this.wideScreen;
  }

  // disableRightClick(event: MouseEvent): void {
  //   event.preventDefault();
  // }

  // disableF12(event: KeyboardEvent): void {
  //   if (event.keyCode === 123) { // F12 key code
  //     event.preventDefault();
  //   }
  // }


}