import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

interface Config {
  readonly maxGreetings: number;
}

interface Greeting {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = 'Cloud';
  greetings: Greeting[] = [];
  maxGreetings: number | null = null;

  @ViewChild(NgForm)
  form!: NgForm;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchConfig();
    this.fetchGreetings();
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    this.http.post<Greeting>('/api/greetings', this.form.value).subscribe(greeting => {
      this.greetings.unshift(greeting);
      this.pruneExtraGreetings();
    });
  }

  private fetchConfig() {
    this.http.get<Config>('/api/config').subscribe(config => {
      this.maxGreetings = config.maxGreetings;
      this.pruneExtraGreetings();
    });
  }

  private fetchGreetings() {
    this.http.get<Greeting[]>('/api/greetings').subscribe(greetings => {
      this.greetings = greetings;
      this.pruneExtraGreetings();
    });
  }

  private pruneExtraGreetings() {
    if (!this.maxGreetings) {
      return;
    } else if (this.greetings.length < this.maxGreetings) {
      return;
    }

    this.greetings.splice(this.maxGreetings, this.greetings.length - this.maxGreetings);
  }
}
