import { NgModule } from '@angular/core';
import { StoryComponent } from './story/story';
import { RankingComponent } from './ranking/ranking';
import { FollowingComponent } from './following/following';
import { FollowersComponent } from './followers/followers';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { MapComponent } from './map/map';
@NgModule({
    declarations: [StoryComponent,
        RankingComponent,
        FollowingComponent,
        StoryComponent,
        FollowersComponent,
    ProgressBarComponent,
    MapComponent,
    ],
    imports: [],
    exports: [StoryComponent,
        RankingComponent,
        FollowingComponent,
        StoryComponent,
        FollowersComponent,
    ProgressBarComponent,
    MapComponent,
    ]
})
export class ComponentsModule { }
