import { getFormattedCoinPairs } from 'common/hive-engine';
import { HiveEngine } from 'services/hive-engine';
import { DialogController } from 'aurelia-dialog';
import { autoinject, TaskQueue } from 'aurelia-framework';
import { environment } from 'environment';

@autoinject()
export class DepositModal {
    private environment = environment;
    private user: any;
    private token: any = null;
    private depositInfo: any = null;
    private loading = false;
    private tokenList = [];
    
    private amount = '0.000';

    constructor(private controller: DialogController, private se: HiveEngine, private taskQueue: TaskQueue) {
        this.controller.settings.lock = false;
        this.controller.settings.centerHorizontalOnly = true;        
    }

    async activate() {   
        const pairs = await getFormattedCoinPairs();   
        
        this.tokenList = pairs;
    }

    tokenSelected() {
        this.taskQueue.queueMicroTask(async () => {
            this.loading = false;

            if (this.token !== 'HIVE') {
                this.loading = true;

                try {
                    const result = await this.se.getDepositAddress(this.token);
                    
                    if (result) {
                        this.depositInfo = result;
                    }
                } finally {
                    this.loading = false;
                }
            }
        });
    }

    async depositHive() {
        this.loading = true;

        try {
            const result = await this.se.depositHive(parseFloat(this.amount).toFixed(3));

            if (result) {
                this.loading = false;
                this.controller.ok();
            } else {
                this.loading = false;
            }
        } finally {
            this.loading = false;
        }
    }
}
