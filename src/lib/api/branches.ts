import request from ".";
import { ILanguageObject, ILocationObject } from "./types";



interface IBranchPost {
    name?: ILanguageObject;
    location?: ILocationObject,
    is_accepting_orders?: Boolean;
    busy?;
    average_time_waiting?;
}

export const branchesApi = {
    get: () => request.get("/branches"),
    create: (branchData) => request.post("/branches", branchData),
    edit: (branchData, branchId) => request.put("/branches/" + branchId, { ...branchData }),
    delete: (branchId) => request.delete("/branches/" + branchId)
}

export const branchUserApi = {
    getPairedBranches: () => request.get('/branchusers/paired_branches'),
    generateBranchPairToken: (branchId) => request.get('branchusers/get_branch_pair_token?active_branch=' + branchId),
    unpairBranchAccount: (branchAccount) => request.post('branchusers/unpair_branch_account' + {
        "active_branch": branchAccount
    }),
}