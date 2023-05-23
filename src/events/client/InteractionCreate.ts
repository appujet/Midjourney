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
        } else if (interaction.isButton()) {
            if (interaction.customId === 'refresh') {
                const { guild, message } = interaction;
                if (!guild || !message) return;
                if (interaction.user.id !== message.author.id) {
                    await interaction.reply({ content: 'You can\'t refresh this message!', ephemeral: true });
                    return;
                }
                await interaction.deferUpdate({ fetchReply: true });
                
                function filterWord(content: string): string {
                    const withoutAsterisks = content.replace(/\*/g, '');
                    const withoutPattern = withoutAsterisks.replace(/<@[\d]+>/g, '');
                    const withoutDash = withoutPattern.replace(/-/g, '');

                    return withoutDash;
                }
                const content = filterWord(message.content);
                if (!content) return;
                await interaction.editReply({ content: `**${content}** - ${interaction.user.toString()}` });
                const prediction = await this.client.replicate.run(this.client.config.model, {
                    input: {
                        prompt: content,
                        num_outputs: 4,
                    },
                }) as string[];
                const rowImg = await this.client.canvas.mergeImages({
                    width: 1000,
                    height: 1000,
                    images: prediction as string[]
                });
                const attachment = new AttachmentBuilder(rowImg)
                    .setName('imagine.png');
                const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        ...prediction.map((_, i) => new ButtonBuilder()
                            .setLabel(`${i + 1}`)
                            .setStyle(ButtonStyle.Link)
                            .setURL(prediction[i])),
                        new ButtonBuilder()
                            .setCustomId('refresh')
                            .setEmoji('🔄')
                            .setStyle(ButtonStyle.Primary)
                    );
                const row2 = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Get more prompt")
                            .setStyle(ButtonStyle.Link)
                            .setURL('https://prompthero.com/openjourney-prompts')
                );
                
                await interaction.editReply({ files: [attachment], components: [row, row2] });
            }
        }
    }
}