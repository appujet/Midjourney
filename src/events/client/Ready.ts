import { Event, Bot, GatewayDispatchEvents } from '../../structures/index.js';


export default class Ready extends Event  {
    constructor(client: Bot, file: string) {
        super(client, file, {
            name: GatewayDispatchEvents.Ready,
        });
    }
    public async run(): Promise<void> {
        this.client.logger.info(`Connected to Discord as ${this.client.user?.tag}!`);

        this.client.user?.setActivity({
            name: 'with discord.js',
            type: 3,
        });
    }
}