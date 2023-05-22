import { CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, AttachmentBuilder } from 'discord.js';
import { Command, Bot } from "../../structures/index.js";


export default class Imagine extends Command {
    constructor(client: Bot) {
        super(client, {
            name: 'imagine',
            description: {
                content: '📷 | Creates an image from a prompt',
                usage: 'imagine <prompt>',
                examples: [
                    'imagine',
                ],
            },
            category: 'fun',
            cooldown: 3,
            permissions: {
                client: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles],
                user: [PermissionFlagsBits.SendMessages],
                dev: false
            },
            options: [
                {
                    name: 'prompt',
                    description: 'The prompt to use',
                    type: 3,
                    required: true
                }
            ]
        });
    }
    async run(client: Bot, interaction: CommandInteraction) {

        const prompt = interaction.options.data[0].value as string;
        await interaction.deferReply({ fetchReply: true });
        await interaction.editReply({ content: `**${prompt}** - ${interaction.user.toString()}` });

        const prediction = await client.replicate.run(this.client.config.model, {
            input: {
                prompt: prompt,
                num_outputs: 4,
            },
        });
        const rowImg = await client.canvas.mergeImages({
            width: 1000,
            height: 1000,
            images: prediction as string[]
        });
        const attachment = new AttachmentBuilder(rowImg)
            .setName('imagine.png');
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('1')
                    .setStyle(ButtonStyle.Link)
                    .setURL(prediction[0]),
                new ButtonBuilder()
                    .setLabel('2')
                    .setStyle(ButtonStyle.Link)
                    .setURL(prediction[1]),
                new ButtonBuilder()
                    .setLabel('3')
                    .setStyle(ButtonStyle.Link)
                    .setURL(prediction[2]),
                new ButtonBuilder()
                    .setLabel('4')
                    .setStyle(ButtonStyle.Link)
                    .setURL(prediction[3]),
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
        )
        await interaction.editReply({ files: [attachment], components: [row, row2] })
    }
}