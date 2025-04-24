"use client";

import { auth } from "@/firebase/client";
import { refreshSession } from "@/lib/actions/auth.action";
import { onIdTokenChanged } from "firebase/auth";
import { useEffect } from "react";

// import React from 'react'

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const LAST_REFRESH_KEY = "lastSessionRefresh";
const SessionRefresher = () => {
	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, async (user) => {
			if (!user) {
				return;
			} else if (user) {
				// 1. Get the last time the session was refreshed from local storage:
				const lastSessionRefresh = Number(
					localStorage.getItem(LAST_REFRESH_KEY) || 0
				);
				const now = Date.now();

				// 2. Only refresh the session if the last refresh was more than 24 hours ago:
				if (now - lastSessionRefresh < MS_PER_DAY) {
					return;
				}

				// 3. Force‑refresh the ID token (gets a new JWT)
				const idToken = await user.getIdToken(true);
				// 4. Call your Server Action to mint & set a fresh 7‑day cookie
				await refreshSession(idToken);

				// 5. Update the last time the session was refreshed in local storage:
				localStorage.setItem(LAST_REFRESH_KEY, now.toString());
			}
		});

		return () => unsubscribe();
	}, []);

	return null;
};

export default SessionRefresher;
