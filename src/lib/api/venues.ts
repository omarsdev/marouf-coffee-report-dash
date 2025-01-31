import request from ".";
import { ILanguageObject, ILocationObject } from "./types";


type Gender = 'male' | 'female' | 'none'

interface MultiLang {
    en: String;
    ar: String;
}

interface IVenuePost {
    gender: Gender,
    name: MultiLang,
    booking_days_after_allowed: number,
    image: MultiLang,
    priority;
    open;
    categories: Array<String>;
    phone_number;
    top_rated;
}

interface IVenuePut {
    gender?: Gender,
    name?: MultiLang,
    booking_days_after_allowed?: number,
    image?: MultiLang,
    priority?;
    open?;
    categories?: Array<String>;
    phone_number?;
    top_rated?;
    status?;
}

export const venuesApi = {
    get: () => request.get("/venues"),
    create: (venueData) => request.post("/venues", venueData),
    edit: (venueData, venueId) => request.put("/venues/" + venueId, { ...venueData }),
    delete: (venueId) => request.delete("/venues/" + venueId)
}

// export const branchUserApi = {
//     getPairedBranches: () => request.get('/branchusers/paired_branches'),
//     generateBranchPairToken: (branchId) => request.get('branchusers/get_branch_pair_token?active_branch=' + branchId),
//     unpairBranchAccount: (branchAccount) => request.post('branchusers/unpair_branch_account' + {
//         "active_branch": branchAccount
//     }),
// }