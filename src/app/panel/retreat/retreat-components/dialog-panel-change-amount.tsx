import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { Dispatch } from "react";

const DialogPanelChangeAmount = ({
  open,
  setOpen,
  onConfirm,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
  onConfirm: (amount: number) => void;
}) => {
  const [amount, setAmount] = React.useState<number>(0);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insira o valor</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="col-span-3"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancela</Button>
          </DialogClose>
          <Button
            onClick={() => {
              onConfirm(amount);
            }}
          >
            Confirma
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPanelChangeAmount;
