import {adminClient, usernameClient} from "better-auth/client/plugins";
import {createAuthClient} from "better-auth/react";

export const authClient = createAuthClient({
    plugins: [usernameClient(), adminClient()]
})


export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;