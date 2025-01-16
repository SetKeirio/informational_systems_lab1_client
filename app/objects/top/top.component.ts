import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/algorithms/database.algorithm';
import { LocalstorageAlgorithm } from 'src/app/algorithms/localstorage.algorithm';
import { Router } from '@angular/router';
import { LoginAlgorithm } from 'src/app/algorithms/login.algorithm';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
  currentUser: string | null;
  currentUserId: number = -1;
  requestMessage: string = ''; // Сообщение для уведомления
  showMessage: boolean = false; // Показывать ли сообщение

  constructor(private storageService: LocalstorageAlgorithm, private databaseService: DatabaseService, private router: Router, private loginAlgorithm: LoginAlgorithm) {
  }

  ngOnInit(): void {
  }

}