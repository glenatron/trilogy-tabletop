import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { TrilogyGameService } from './Services/trilogy-game.service';
import { AppComponent } from './Components/app.component';
import { GmViewComponent } from './Components/gm-view/gm-view.component';
import { PlayerViewComponent } from './Components/player-view/player-view.component';
import { SceneComponent } from './Components/scene/scene.component';
import { NpcComponent } from './Components/npc/npc.component';
import { DiceComponent } from './Components/dice/dice.component';
import { CharacterComponent } from './Components/character/character.component';
import { LocationListComponent } from './Components/location-list/location-list.component';
import { LocationComponent } from './Components/location/location.component';
import { CounterComponent } from './Components/counter/counter.component';
import { StatComponent } from './Components/stat/stat.component';
import { HarmTrackComponent } from './Components/harm-track/harm-track.component';
import { NpcListComponent } from './Components/npc-list/npc-list.component';
import { MoveComponent } from './Components/move/move.component';
import { CharacterFormComponent } from './Components/character-form/character-form.component';
import { CharacterEquipmentComponent } from './Components/character-equipment/character-equipment.component';
import { EquipmentItemComponent } from './Components/equipment-item/equipment-item.component';
import { ArmourComponent } from './Components/armour/armour.component';
import { ArcComponent } from './Components/arc/arc.component';
import { PlayerComponent } from './Components/player/player.component';
import { PlayerListComponent } from './Components/player-list/player-list.component';
import { MoveFormComponent } from './Components/move-form/move-form.component';
import { ChatComponent } from './Components/chat/chat.component';
import { GmMenuComponent } from './Components/gm-menu/gm-menu.component';
import { SafeHtmlPipe } from './Services/safe-html.pipe';
import { FocusContainerComponent } from './Components/focus-container/focus-container.component';
import { FocusListSetComponent } from './Components/focus-list-set/focus-list-set.component';
import { ModalWindowComponent } from './Components/modal-window/modal-window.component';
import { TwoWayCounterComponent } from './Components/two-way-counter/two-way-counter.component';

@NgModule({
    declarations: [
        AppComponent,
        GmViewComponent,
        PlayerViewComponent,
        SceneComponent,
        LocationComponent,
        NpcComponent,
        DiceComponent,
        CharacterComponent,
        LocationListComponent,
        CounterComponent,
        StatComponent,
        HarmTrackComponent,
        NpcListComponent,
        MoveComponent,
        CharacterFormComponent,
        CharacterEquipmentComponent,
        EquipmentItemComponent,
        ArmourComponent,
        ArcComponent,
        PlayerComponent,
        PlayerListComponent,
        MoveFormComponent,
        ChatComponent,
        GmMenuComponent,
        SafeHtmlPipe,
        FocusContainerComponent,
        FocusListSetComponent,
        ModalWindowComponent,
        TwoWayCounterComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule
    ],
    providers: [TrilogyGameService],
    bootstrap: [AppComponent]
})
export class AppModule { }
