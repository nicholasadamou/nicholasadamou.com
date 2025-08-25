import SourceCodeForm from "./SourceCodeForm";
import { toast } from "react-hot-toast";

interface SourceCodeAccessProps {
  owner?: string;
  repo: string;
  org?: string;
  team?: string;
}

export default function SourceCodeAccess(props: SourceCodeAccessProps) {
  const handleSubmit = async (data: { username: string; email: string }) => {
    try {
      const { owner, repo, org, team } = props;
      let endpoint = "";

      if (owner) {
        endpoint = `/api/github/${owner}/${repo}`;
      } else if (org && team) {
        endpoint = `/api/github/${org}/${team}/${repo}`;
      } else {
        console.error("Insufficient information to determine the request type");
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          `${data.username} was successfully granted access to the source code.`
        );
      } else {
        toast.error(`Error adding ${data.username}. Please try again.`);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return <SourceCodeForm onSubmit={handleSubmit} />;
}
