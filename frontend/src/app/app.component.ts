import { Component, Input, OnInit } from '@angular/core';
import { ProjectDataCacheService } from 'src/app/project-data-cache.service';

@Component({
	selector: 'app-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	@Input()
	public prefix: string = '';

	public constructor(public readonly projectDataCacheService: ProjectDataCacheService, ) {

	}

	public ngOnInit(): void {
	}
}
