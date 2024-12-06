import { writable, get } from 'svelte/store';

type ChatStore = {
	submitPrompt: ((prompt: string) => Promise<any>) | null;
	stopResponse: (() => void) | null;
	regenerateResponse: ((message: any) => Promise<void>) | null;
	// 可以添加其他需要的方法
};

// 创建store
const createChatStore = () => {
	const { subscribe, set, update } = writable<ChatStore>({
		submitPrompt: null,
		stopResponse: null,
		regenerateResponse: null
	});

	return {
		subscribe,
		registerMethods: (methods: Partial<ChatStore>) => {
			update((store) => ({ ...store, ...methods }));
		},
		// 提供便捷方法
		submitPrompt: async (prompt: string) => {
			const store = get({ subscribe });
			if (!store.submitPrompt) {
				throw new Error('Chat methods not initialized');
			}
			return store.submitPrompt(prompt);
		},
		stopResponse: () => {
			const store = get({ subscribe });
			if (!store.stopResponse) {
				throw new Error('Chat methods not initialized');
			}
			store.stopResponse();
		},
		regenerateResponse: async (message: any) => {
			const store = get({ subscribe });
			if (!store.regenerateResponse) {
				throw new Error('Chat methods not initialized');
			}
			return store.regenerateResponse(message);
		}
	};
};

export const chatStore = createChatStore();
