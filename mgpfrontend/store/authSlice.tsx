import { createSlice } from '@reduxjs/toolkit';

const getTokenFromLocalStorage = () => {
    const jwt = require('jsonwebtoken');
    try {
        const token = localStorage.getItem('token');
        console.log(token);
        let id = null;
        let firstname = null;
        let lastname = null;
        let email = null;
        let profileLogo = null;
        let role = null;
        let username = null;

        const jwtString = token ? JSON.parse(token).token : null;

        const decodedToken = jwt.decode(jwtString);
        // console.log('decod', decodedToken);
        id = decodedToken.sub;
        firstname = decodedToken.firstname;
        lastname = decodedToken.lastname;
        email = decodedToken.email;
        profileLogo = decodedToken.logo;
        role = decodedToken.role;
        username = decodedToken.username;
        // console.log('profileLogo', profileLogo);

        return { token, id, firstname, lastname, email, profileLogo, role, username };
    } catch (error) {
        return null;
    }
};
// const initialState = {
// isAuth: typeof window !== 'undefined' && typeof localStorage.getItem('token') !== 'string' ? false : true,
// value: typeof window !== 'undefined' && typeof localStorage.getItem('token') !== 'string' ?  null : JSON.parse(window.localStorage.getItem('token') )
// }
const initialState: auth = {
    isAuth: getTokenFromLocalStorage() !== null ? true : false,
    value: {
        user: {
            id: getTokenFromLocalStorage()?.id,
            firstname: getTokenFromLocalStorage()?.firstname,
            lastname: getTokenFromLocalStorage()?.lastname,
            dob: '',
            email: getTokenFromLocalStorage()?.email,
            password: '',
            role: getTokenFromLocalStorage()?.role,
            username: getTokenFromLocalStorage()?.username,
            profileLogo: getTokenFromLocalStorage()?.profileLogo || 'profile-unknown.jpeg',
        },
    },
    additionalVariable: false,
    additionalVariablePrompts: false,
    addSavedprompt: false,
    addToFavorite: false,
    TxtSavedPrompt: '',
};
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuth = true;
            state.value = action.payload;
            localStorage.setItem('token', JSON.stringify(action.payload));
        },
        logout: (state) => {
            localStorage.removeItem('token');
            // document.cookie = 'token=;'
            // state.isAuth = false
            // state.value = null
            state.isAuth = initialState?.isAuth;
            state.value = initialState?.value;
        },

        setProfil: (state, action) => {
            state.value = {
                user: {
                    ...state.value?.user,
                    ...action.payload,
                },
            };
        },
        setAdditionalVariable: (state, action) => {
            state.additionalVariable = action.payload;
        },
        setAdditionalVariablePrompts: (state, action) => {
            state.additionalVariablePrompts = action.payload;
        },

        setTxtSavedPrompts: (state, action) => {
            state.TxtSavedPrompt = action.payload;
        },
        setAddSavedprompt: (state, action) => {
            state.addSavedprompt = action.payload;
        },
        setAddToFavorite: (state, action) => {
            state.addToFavorite = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, (state) => {
            state.isAuth = false;
            state.value = null;
        });
    },
});

// export const selectAdditionalVariable = (state: any) => state.auth.additionalVariable;

export const { login, logout, setAdditionalVariable, setAdditionalVariablePrompts, setAddSavedprompt, setTxtSavedPrompts, setAddToFavorite, setProfil } = authSlice.actions;
export default authSlice.reducer;
