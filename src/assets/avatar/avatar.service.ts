import { Injectable } from "@angular/core";






@Injectable({providedIn: 'root'})
export class AvatarService {

    getAvatar() {
        return [
            {
                avatarUrl: 'assets/avatar/avatar-unknown.png'
            },
            {
                avatarUrl: 'assets/avatar/avatar-boy.png'
            },
            {
                avatarUrl: 'assets/avatar/avatar-man-2.png'
            },
            {
                avatarUrl: 'assets/avatar/avatar-man-3.png'
            },
            {
                avatarUrl: 'assets/avatar/avatar-beard.png'
            },
            {
                avatarUrl: 'assets/avatar/avatar-woman.png'
            },
            {
                avatarUrl: 'assets/avatar/avatar-lady-glass.png'
            },
            {
                avatarUrl: 'assets/avatar/avatar-girl-3.png'
            },
            {
                avatarUrl: 'assets/avatar/avatar-girl-4.png'
            },
        ]
    }

}