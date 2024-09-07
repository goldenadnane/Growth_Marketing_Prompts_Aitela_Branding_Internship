interface plan {
    currency: string;
    // features: string[];
    chat_per_day: number;
    pre_made_prompt: number;
    saved_prompt: number;
    custom_instructions: number;
    id?: number;
    is_available: boolean;
    name: string;
    payment_cycle: any;
    price: number;
}
interface auth {
    isAuth: boolean;
    additionalVariable?: any;
    additionalVariablePrompts?: any;
    addToFavorite?: any;
    addSavedprompt?: boolean;
    TxtSavedPrompt?: any;
    value: {
        user?: {
            id?: number;
            firstname: string;
            lastname: string;
            email: string;
            username: string;
            dob: string;
            profileLogo: string;
            role: string;
            password: string;
        };
    } | null;
}
interface userInfo {
    id?: number;
    firstname: string | undefined;
    lastname: string | undefined;
    email: string | undefined;
    username: string | undefined;
    dob: string | undefined;
    profileLogo: string | undefined;
    role: string | undefined;
    password: string | undefined;
}

interface userInfoEdit {
    id?: number;
    firstname: string | undefined;
    lastname: string | undefined;
    email: string | undefined;
    username: string | undefined;
    password: string | undefined;
    confirmPassword: string | undefined;
    profile_logo: string | undefined;
    status: string | undefined;
    role: string | undefined;
}

interface password {
    password: string;
    new_password: string;
    confirm_password: string;
}

interface ManagSettingInstruction {
    id?: number;
    brand: string | undefined;
    product_service: string | undefined;
    target_audience: string | undefined;
    feature1: string | undefined;
    feature2: string | undefined;
    feature3: string | undefined;
}
interface authMgSt {
    isAuth: boolean;
    ManegInstrct: {
        user?: {
            id?: number;
            brand: string | undefined;
            product_service: string | undefined;
            target_audience: string | undefined;
            feature1: string | undefined;
            feature2: string | undefined;
            feature3: string | undefined;
        };
    } | null;
}
