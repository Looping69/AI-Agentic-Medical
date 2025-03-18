import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpCircle, ChevronDown, Plus } from "lucide-react";

interface PredefinedQuestionsDropdownProps {
  onSelectQuestion: (question: string) => void;
  category?: "general" | "symptoms" | "history" | "treatment" | "all";
}

type QuestionCategory = {
  label: string;
  questions: string[];
};

export default function PredefinedQuestionsDropdown({
  onSelectQuestion,
  category = "all",
}: PredefinedQuestionsDropdownProps) {
  const [open, setOpen] = useState(false);

  const questionCategories: QuestionCategory[] = [
    {
      label: "General",
      questions: [
        "How are you feeling today?",
        "When did your symptoms first appear?",
        "Have you experienced this before?",
        "Are you currently taking any medications?",
        "Do you have any allergies?",
      ],
    },
    {
      label: "Symptoms",
      questions: [
        "Can you rate your pain on a scale of 1-10?",
        "Is the pain constant or intermittent?",
        "Does anything make the symptoms better or worse?",
        "Have you noticed any patterns to when symptoms occur?",
        "Are your symptoms affecting your daily activities?",
      ],
    },
    {
      label: "Medical History",
      questions: [
        "Do you have any chronic conditions?",
        "Have you had any surgeries in the past?",
        "Is there a family history of this condition?",
        "When was your last physical examination?",
        "Have you been hospitalized recently?",
      ],
    },
    {
      label: "Treatment",
      questions: [
        "Have you tried any treatments for this condition?",
        "How have you responded to previous treatments?",
        "Are you following any specific diet or exercise regimen?",
        "Have you consulted with any specialists?",
        "What are your treatment goals?",
      ],
    },
  ];

  // Filter categories based on the selected category
  const filteredCategories =
    category === "all"
      ? questionCategories
      : questionCategories.filter((cat) =>
          cat.label.toLowerCase().includes(category),
        );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>Predefined Questions</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[350px]">
        <DropdownMenuLabel>Select a question</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filteredCategories.map((category, index) => (
          <div key={category.label}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {category.label}
              </DropdownMenuLabel>
              {category.questions.map((question) => (
                <DropdownMenuItem
                  key={question}
                  onClick={() => {
                    onSelectQuestion(question);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-3 w-3" />
                  <span className="text-sm">{question}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
