import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, MatButtonModule, MatDividerModule, MatIconModule,
    MatCardModule, MatInputModule, MatFormFieldModule, MatSidenavModule,
    MatListModule, MatToolbarModule, MatTab, MatTabGroup,
    MatCheckbox, MatDialogModule, MatMenuModule
    ],
  exports: [
    CommonModule, MatButtonModule, MatDividerModule, MatIconModule,
    MatCardModule, MatInputModule, MatFormFieldModule, MatSidenavModule,
    MatListModule, MatToolbarModule, MatTab, MatTabGroup,
    MatCheckbox, MatDialogModule, MatMenuModule
  ]
})
export class AngularmaterialModule { }
