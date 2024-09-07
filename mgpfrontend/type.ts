// Dashboard
export type UsermonthlycountType = {
    totalUsers: number;
    monthlyCounts: [
        {
            month: number;
            totalusers: number;
        }
    ];
};

export type ConversationmonthlycountType = {
    totalConversations: number;
    monthlyCounts: [
        {
            month: number;
            totalconversations: number;
        }
    ];
};

export type WordsmonthlycountType = {
    totalMessages: number;
    monthlyCounts: [
        {
            month: number;
            totalmessages: number;
        }
    ];
};

export type SpentmonthlycountType = {
    totalSpent: number;
    monthlyTotals: [
        {
            month: number;
            total: number;
        }
    ];
};

// End Dashboard

// Start Users
export type SelectedUserDataEdit = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    status: string;
    username: string;
    profile_logo: string;
    role: string;
};

export type Allusers = {
    id: number;
    profile_logo: string;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    status: string;
    role: string;
    spent: number;
    subscribed: boolean;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
    passwordResetToken: string;
    passwordResetTokenExpiration: string;
};

export type userByid = {
    id: number;
    profile_logo: string;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    status: string;
    role: string;
    spent: number;
    subscribed: boolean;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
    passwordResetToken: string;
    passwordResetTokenExpiration: string;
    pre_made_prompt: number;
    chat_per_day: number;
    saved_prompt: number;
    custom_instructions: number;
    custom_instuctions_status: boolean;
};
// End Users

// Start Prompts
export type AllPrompts = {
    prompt_id: number;
    prompt_prompt_text: string;
    prompt_used: number;
    prompt_status: boolean;
    prompt_createdAt: string;
    category_name: string;
    subcategory_name: string;
    prompt_goal: string;
};

export type AllPromptsSaved = {
    id: number;
    content: string;
    user_id: number;
    prompt_id: number;
};

export type SelectedPromptsDataEdit = {
    prompt_id: number;
    prompt_prompt_text: string;
    prompt_status: boolean;
    category_name: string;
    subcategory_name: string;
    prompt_goal: string;
};

// End Prompts

// Start Categorys
export type AllCategorys = {
    id: number;
    name: string;
    is_free: boolean;
};

// End Categorys

// Start SubCategorys
export type AllSubCategorys = {
    id: number;
    name: string;
};

// End SubCategorys

// Start SubCategorys
export type AllMails = {
    id: number;
    title: string;
    text: string;
    sentdAt: string;
    Sent?: string;
    Viewed?: string;
};

// End SubCategorys

// Start Plans
export type AllPlans = {
    id: number;
    name: string;
    price: number;
    pre_made_prompt: number;
    chat_per_day: number;
    saved_prompt: number;
    custom_instructions: number;
    is_available: boolean;
    payment_cycle: string;
    currency: string;
};

export type PaymentCycleType = {
    [key: string]: string;
};

// End Plans

// Start Category
export type AllCategory = {
    id: number;
    name: string;
    is_free: boolean;
};
export type AllCategoryAndSubCategory = {
    id: number;
    name: string;
    is_free: boolean;
    subcategories: {
        id: number;
        name: string;
    };
};
// End Category

// Start Conversation
export type AllConveration = {
    id: number;
    title: string;
};
export type Message = {
    id: number;
    sender: string;
    text: string;
    createdAt: string;
    saved: boolean;
};

export type AllConverationChat = {
    id: number;
    title: string;
    message: Message[];
};

// End Conversation

export type AllPayment = {
    id: number;
    payment_date: string;
    user: {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
    };
    plan: {
        id: number;
        name: string;
        price: number;
    };
};

// Start Branding
export type AllBrading = {
    id: number;
    brand: string;
    product_service: string;
    target_audience: string;
    feature1: string;
    feature2: string;
    feature3: string;
};

// End Branding

export type userloging = {
    email: string;
    iat: number;
    role: string;
    status: string;
    sub: number;
};
