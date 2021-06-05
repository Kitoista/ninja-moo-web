import { Component, Input, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';

@Component({
    selector: 'app-moomoo',
    templateUrl: './moomoo.component.html',
    styleUrls: ['./moomoo.component.css']
})
export class MoomooComponent implements OnInit {

    @Input() name = "Moo Moo";
    alive = false;
    files: any = [];

    constructor(private backend: BackendService) { }

    ngOnInit(): void {
        this.backend.status(this.name).subscribe((res: any) => {
            this.alive = res.alive;
        });
        setInterval(() => {
            this.backend.status(this.name).subscribe((res: any) => {
                this.alive = res.alive;
            });
        }, 20000);
    }

    host() {
        this.backend.host(this.name).subscribe(console.log);
    }

    kill() {
        this.backend.kill(this.name).subscribe(console.log);
    }

    onFileChange(e: any) {
        this.files = e.target.files;
    }

    upload() {
        console.log(this.files);
        if (this.files.length > 0) {
            this.backend.upload(this.name, this.files).subscribe(console.log);
        }
    }

}
