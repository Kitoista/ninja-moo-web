import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackendService {

    constructor(private http: HttpClient) { }

    status (name: string) {
        const url = environment.appHost + environment.urls.get.status + "/" + name;
        return this.http.get(url);
    }

    host (name: string) {
        const url = environment.appHost + environment.urls.post.host;
        const body = {
            name: name
        };
        return this.http.post(url, body);
    }

    kill (name: string) {
        const url = environment.appHost + environment.urls.post.kill;
        const body = {
            name: name
        };
        return this.http.post(url, body);
    }

    upload (name: string, files: FileList) {
        const url = environment.appHost + environment.urls.post.upload;
        const formData = new FormData();
        
        formData.append("name", name);
        formData.append("file", files[0]);
        
        return this.http.post(url, formData);
    }

}
