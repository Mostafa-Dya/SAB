import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CommentConfigService {
  adminMaxLength = 1000;
  userMaxLength = 256;
}
