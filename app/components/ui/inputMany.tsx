import { SetStateAction } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { Card } from "./card";

export default function InputMany({
  ...props
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  label: string;
  placeholder?: string;
  name: string;
  values: string[];
  setValues: React.Dispatch<SetStateAction<string[]>>;
}) {
  const { inputRef, name, label, placeholder, values, setValues } = props;

  return (
    <div>
      <Label htmlFor={`${name}Input`}>{label}</Label>
      <Input
        ref={inputRef}
        id={`${name}Input`}
        name={`${name}Input`}
        placeholder={placeholder || ""}
        enterKeyHint="done"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            if (
              inputRef.current &&
              !values.includes(inputRef.current.value.trim())
            ) {
              setValues((prev) => [
                ...prev,
                inputRef?.current?.value.trim() || "",
              ]);
            }
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }
        }}
      ></Input>
      <Button
        type="button"
        onClick={() => {
          if (
            inputRef.current &&
            !values.includes(inputRef.current.value.trim())
          ) {
            setValues((prev) => [
              ...prev,
              inputRef?.current?.value.trim() || "",
            ]);
          }
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        }}
        variant={"secondary"}
        className="my-3 w-full"
      >
        Add
      </Button>
      {values.length > 0 ? (
        <Card className="p-4 space-y-4">
          {values.map((value, index) => (
            <div key={index} className="flex items-center gap-3">
              <Button
                type="button"
                className="aspect-square"
                onClick={() => {
                  setValues((prev) => prev.filter((v) => v !== value));
                }}
              >
                -
              </Button>
              <p className="truncate">{value}</p>
              <input
                hidden
                value={value}
                readOnly
                name={`${name}[]`}
                className="w-full"
              />
            </div>
          ))}
        </Card>
      ) : null}
    </div>
  );
}
