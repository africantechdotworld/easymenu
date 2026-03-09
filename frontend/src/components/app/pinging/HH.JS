export const AuthConsentDialog = ({ isOpen, onClose, onAccept, title, message }) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title || "Enable Features"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message || 
                         "To enable features like favorites and reviews, we need to create an anonymous profile. " +
                         "No personal information is required or collected."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onAccept}>
                        Accept & Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};