import { CommandInteraction, Integration } from 'discord.js';
import { Command, Bot } from "../../structures/index.js";


export default class Imagine extends Command {
    constructor(client: Bot) {
        super(client, {
            name: 'imagine',
            description: {
                content: 'Imagine something',
                usage: '[text]',
                examples: ['Imagine being a good bot']
            },
            category: 'fun',
            cooldown: 3,
            options: [
                {
                    name: 'prompt',
                    description: 'The prompt to imagine',
                    type: 3,
                    required: true
                }
            ]
        });
    }
    async run(client: Bot, integration: CommandInteraction) {
        await integration.deferReply();
        await integration.editReply(`Imagine ${integration.options.get('prompt')}`);
    }
}