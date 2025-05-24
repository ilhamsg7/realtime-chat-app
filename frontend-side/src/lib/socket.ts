class WebSocketClient {
    private ws: WebSocket | null = null;
    private url: string;
    public messageCallbacks: ((message: any) => void)[] = [];

    constructor() {
        this.url = 'ws://localhost:3000/cable';
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('WebSocket Connected');
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received:', data);

            // Handle different message types
            if (data.type === 'ping') return;
            if (data.type === 'welcome') return;
            if (data.type === 'confirm_subscription') return;

            // Handle actual message
            if (data.message) {
                this.handleMessage(data.message);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setTimeout(() => this.connect(), 3000);
        };
    }

    subscribe(roomId: number) {
        if (!this.ws) return;
        
        const subscription = {
            command: 'subscribe',
            identifier: JSON.stringify({
                channel: 'ChatRoomChannel',
                room_id: roomId
            })
        };
        this.ws.send(JSON.stringify(subscription));
    }

    sendMessage(roomId: number, content: string) {
        if (!this.ws) return;

        const message = {
            command: 'message',
            identifier: JSON.stringify({
                channel: 'ChatRoomChannel',
                room_id: roomId
            }),
            data: JSON.stringify({
                action: 'speak',
                content
            })
        };
        this.ws.send(JSON.stringify(message));
    }

    onMessage(callback: (message: any) => void) {
        this.messageCallbacks.push(callback);
    }

    private handleMessage(message: any) {
        this.messageCallbacks.forEach(cb => cb(message));
    }

    clearCallbacks() {
        this.messageCallbacks = [];
    }
}

export const socket = new WebSocketClient();