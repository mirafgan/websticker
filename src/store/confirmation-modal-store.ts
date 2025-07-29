import {create} from "zustand/react";


type IModalStoreActions = {
    onSubmit: () => void,
}

type IModalStoreData = {
    onSubmit: () => void,
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
        set(initialStore)
    },
}));

export default useConfirmationModal;