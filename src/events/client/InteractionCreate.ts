import { ActionRowBuilder, AttachmentBuilder, Interaction, InteractionType, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Event, Bot, EventsTypes } from '../../structures/index.js';

export default class InteractionCreate extends Event {
    constructor(client: Bot, file: string) {
        super(client, file, {
            name: EventsTypes.InteractionCreate,
        });
    }
    public async run(interaction: Interaction): Promise<void> {
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