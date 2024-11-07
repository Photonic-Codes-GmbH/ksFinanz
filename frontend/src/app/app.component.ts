import { Component, Input, OnInit } from '@angular/core';
import { ProjectDataCacheService } from 'src/app/project-data-cache.service';

@Component({
	selector: 'app-appc72a50a1',
	templateUrl: './appc72a50a1.component.html',
	styleUrls: ['./appc72a50a1.component.scss']
})
export class Appc72a50a1Component implements OnInit {

	@Input()
	public prefix: string = '';

	public constructor(public readonly projectDataCacheService: ProjectDataCacheService, ) {
		
	}

	public ngOnInit(): void {
	}
}
