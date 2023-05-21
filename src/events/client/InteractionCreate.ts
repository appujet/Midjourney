import { Interaction, InteractionType } from 'discord.js';
import { Event, GatewayDispatchEvents, Bot } from '../../structures/index.js';


export default class InteractionCreate extends Event {
    constructor(client: Bot, file: string) {
        super(client, file, {
            name: "InteractionCreate",
        });
    }
    async run(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = this.client.commands.get(interaction.commandName);
            if (!command) return;
            
            try {
                await command.run(this.client, interaction);
            } catch (error) {
                this.client.logger.error(error);
                interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}