import {create} from "zustand/react";


type IModalStoreActions = {
    onSubmit: null | (() => void),
}

type IModalStoreData = {
    onSubmit: null | (() => void),
    isOpen: boolean,
    title: string,
    content: string,
}

type IModalStore = {
    actions: IModalStoreActions,
    isOpen: boolean,
    title: string,
    content: string,
    openModal: (data: IModalStoreData) => void,
    closeModal: () => void,
}

const initialStore = {
    actions: {
        onSubmit: () => {
        },
    },
    isOpen: false,
    title: "",
    content: "",
}
const useConfirmationModal = create<IModalStore>((set) => ({
    ...initialStore,
    openModal: ({onSubmit, title, content}) => {
        set({
            isOpen: true,
            actions: {
                onSubmit,
            },
            title,
            content
        })
    },
    closeModal: () => {
        set((prev) => ({...prev, isOpen: false}));
        setTimeout(() => set(initialStore), 500)
    },
}));

export default useConfirmationModal;