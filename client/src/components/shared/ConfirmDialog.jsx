import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConfirmDialog = ({
  title = "Confirm This Action",
  description = "Are you sure you want to proceed? This action cannot be undone.",
  onConfirm = "Confirm",
  onCancel = "Cancel",
  action = () => {
    console.log("Action confirmed");
  },
  isLoading = false,
  open = false,
  onOpenChange = () => {},
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            {onCancel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={action}
            className="cursor-pointer"
          >
            {onConfirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
