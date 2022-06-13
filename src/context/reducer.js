export let data = {
    authUser: {},
}

export function reducer(state, action) {
    if(action.type == "CURRENT_USER") {
        data.authUser = action.payload;
        console.log(data.authUser);
        return state;
    } 
}