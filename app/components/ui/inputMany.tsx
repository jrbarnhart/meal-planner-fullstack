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
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setValues((prev) => [...prev, inputRef?.current?.value || ""]);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }
        }}
      ></Input>
      <Button
        type="button"
        onClick={() => {
          setValues((prev) => [...prev, inputRef?.current?.value || ""]);
        }}
        variant={"secondary"}
        className="my-3"
      >
        Add
      </Button>
      {values.length > 0 ? (
        <Card className="p-4">
          {values.map((value, index) => (
            <div key={index}>
              <p>{value}</p>
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
