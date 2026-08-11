"use client"

import { createClient } from "@/utils/supabase/client";
import { use, useEffect, useState } from "react"
import { User } from '@supabase/supabase-js'

export const useAuth = () => {

    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            setUser(user)
        }
        getUser();
    }, [supabase])

    return {user};
}

