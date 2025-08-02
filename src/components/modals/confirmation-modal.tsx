"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import useConfirmationModal from "@/store/confirmation-modal-store";

export default function ConfirmationModal() {
    const {closeModal, title, content, isOpen, actions: {onSubmit}} = useConfirmationModal();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            !open && closeModal()
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{content}</DialogDescription>
                </DialogHeader>
                <DialogFooter>

                    {
                        onSubmit ? <>
                                <Button type="button" variant="outline" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <Button type="button" className="bg-green-600 hover:bg-green-700"
                                        disabled={isLoading}
                                        onClick={async () => {
                                            setIsLoading(true)
                                            await onSubmit();
                                            setTimeout(() => {
                                                closeModal();
                                                setIsLoading(false)
                                            }, 500);
                                        }}
                                >
                                    {isLoading ? "Processing..." : "Confirm"}
                                </Button>
                            </>
                            :
                            <Button type="button" className="bg-green-600 hover:bg-green-700"
                                    disabled={isLoading}
                                    onClick={closeModal}
                            >
                                Close
                            </Button>
                    }

                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}