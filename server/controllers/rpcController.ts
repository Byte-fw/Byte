import { getEventNames } from "../shared/classes/eventNameController";

const eventNames = getEventNames();

/**
 * Type of a RPC function that can be called from the client.
 * @param src The player source that called the procedure.
 * @param cb The callback function to call when the procedure is done.
 */
export type RPCCallback = (this: void, src: number, cb: (this: void, ...args: any[]) => void, ...args: any[]) => any;

export class RPCController {
    /** @noSelf **/
    private static instance: RPCController;
    private callbacks: Record<string, RPCCallback> = {};

    private constructor() {
        RegisterNetEvent(eventNames.get("Server.RPC.Call"), (procedure: string, args: Array<any>) => {
            const src = source;
            if (!this.callbacks[procedure]) return;

            const procedureCallback = this.callbacks[procedure];
            procedureCallback(
                src,
                (...retVals: any[]) => {
                    TriggerClientEvent(eventNames.get("Client.RPC.Callback"), src, procedure, retVals);
                },
                ...args
            );
        });
    }

    public registerProcedure = (procedure: string, callback: RPCCallback) => {
        this.callbacks[procedure] = callback;
    };

    public deleteProcedure = (procedure: string) => {
        delete this.callbacks[procedure];
    };

    /** @noSelf **/
    public static getInstance = () => {
        if (!RPCController.instance) {
            RPCController.instance = new RPCController();
        }

        return RPCController.instance;
    };
}
