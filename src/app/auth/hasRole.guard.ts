import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take, switchMap } from "rxjs";
import { AuthService } from "./auth.service";





@Injectable({providedIn: 'root'})
export class HasRoleGuard implements CanActivate{

  constructor(
      private auth: AuthService,
      private router: Router,
  ) {}
  
  canActivate(
      route: ActivatedRouteSnapshot, 
      state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    // return this.auth.user.pipe(
    //   take(1),
    //   map(user => {
    //     if (user && user.accessDetail) {

    //       const hasAccess = user.accessDetail.some(access => access.AccessRight === route.data['role']);

    //       if (hasAccess) {
    //         return true; 
    //       } else {
    //         return this.router.createUrlTree(['/unauthorized']);
    //       }
          
    //     } else {
    //       return this.router.createUrlTree(['/unauthorized']); // Example redirect to an unauthorized page
    //     }
    //   })
    // );

    return this.auth.user.pipe(
    take(1),
    switchMap(user => {
      const user_id = user!.user_id;
      const requiredRole = route.data['role'];

      return this.auth.getUserAccess(user_id).pipe(
        map(access => {
          const isAuthorized = access.some((item: any) => item.AccessRight === requiredRole);

          if (!isAuthorized) {
            return this.router.createUrlTree(['/unauthorized']);
          } else {
            return true;
          }
        })
      );
    })

);
    
  }

}

// return this.auth.user.pipe(
//     take(1),
//     switchMap(user => {
//       const user_id = user!.user_id;
//       const requiredRole = route.data['role'];

//       return this.auth.getUserAccess(user_id).pipe(
//         map(access => {
//           const isAuthorized = access.some((item: any) => item.AccessRight === requiredRole);

//           if (!isAuthorized) {
//             // Redirect to login page if not authorized
//             return this.router.createUrlTree(['/unauthorized']);
//           } else {
//             // Allow access if authorized
//             return true;
//           }
//         })
//       );
//     })

// );