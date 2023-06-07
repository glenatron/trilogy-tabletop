import { Component, OnInit, Input } from '@angular/core';
import { MessageType, IChat } from '../../../../../../trilogy-core/src/Chat';
import { TrilogyGameService } from '../../Services/trilogy-game.service';

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    @Input() public playerId: string = "";

    public latestMessage: string = "";

    public ChatMessageType = MessageType;

    constructor(public gameService: TrilogyGameService) {

    }

    ngOnInit(): void {
    }



    public saySomething(): void {
        this.gameService.say(this.playerId, this.latestMessage);
        this.latestMessage = '';
    }

}



