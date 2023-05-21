import { fetch } from "undici";


export class Midjourney {
    public fetch: typeof fetch;
    constructor() {
        this.fetch = fetch;
    }
    public async create(model: string, data: any) {
        const [path, version] = model.split(':');
        const res = await fetch(`https://replicate.com/api/models/${path}/versions/${version}/predictions`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ inputs: data }),
        });
        const json = await res.json();
        return json;
    }
    public async get(prediction: Prediction) {
        return await fetch(`https://replicate.com/api/models${prediction.version.model.absolute_url}/versions/${prediction.version_id}/predictions/${prediction.uuid}`).then(response => JSON.parse(response.body.toString()).prediction);
    }
    public async run(model: string, data: any) {
        let prediction = await this.create(model, data) as any;
        while (![
            'canceled',
            'succeeded',
            'failed'
        ].includes(prediction.status)) {
            await new Promise(_ => setTimeout(_, 250));
            prediction = await this.get(prediction);
        }
        return prediction.outputs;
    }
}

interface Prediction {
    uuid: string;
    version_id: string;
    version: any;
    inputs: any;
    outputs: any;
    created_at: string;
    updated_at: string;
}