import { Card } from "@/components/ui/card";

export default function UserFlowDiagram() {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        LENY-AI Medical Application User Flow
      </h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Authentication Flow</h2>
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="flex flex-col items-center">
            <Card className="w-full max-w-2xl p-4 mb-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium">Application Start</h3>
              <p className="text-sm text-gray-600">
                User visits the application
              </p>
            </Card>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <Card className="w-full max-w-2xl p-4 mb-4 bg-amber-50 border-amber-200">
              <h3 className="font-medium">Simple Auth Check</h3>
              <p className="text-sm text-gray-600">
                Check if user has admin credentials
              </p>
              <div className="mt-2 flex justify-between">
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  If authenticated → Proceed to Supabase Auth Check
                </div>
                <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  If not authenticated → Show Simple Login Form
                </div>
              </div>
            </Card>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <div className="flex w-full max-w-2xl justify-between mb-4">
              <div className="w-[48%]">
                <Card className="p-4 mb-4 bg-purple-50 border-purple-200 h-full">
                  <h3 className="font-medium">Simple Login Form</h3>
                  <p className="text-sm text-gray-600">
                    Admin login with hardcoded credentials
                  </p>
                  <p className="text-xs mt-2 text-gray-500">
                    Username: klaasvaakie
                  </p>
                  <p className="text-xs text-gray-500">
                    Password: Leatherman@24
                  </p>
                </Card>
              </div>
              <div className="w-[48%]">
                <Card className="p-4 mb-4 bg-green-50 border-green-200 h-full">
                  <h3 className="font-medium">Skip Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Continue as guest user
                  </p>
                  <p className="text-xs mt-2 text-gray-500">
                    Limited functionality
                  </p>
                </Card>
              </div>
            </div>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <Card className="w-full max-w-2xl p-4 mb-4 bg-amber-50 border-amber-200">
              <h3 className="font-medium">Supabase Auth Check</h3>
              <p className="text-sm text-gray-600">
                Check if user is logged in with Supabase
              </p>
              <div className="mt-2 flex justify-between">
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  If authenticated → Show Dashboard
                </div>
                <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  If not authenticated → Show Login/Signup
                </div>
              </div>
            </Card>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <div className="flex w-full max-w-2xl justify-between mb-4">
              <div className="w-[48%]">
                <Card className="p-4 mb-4 bg-indigo-50 border-indigo-200 h-full">
                  <h3 className="font-medium">Login Form</h3>
                  <p className="text-sm text-gray-600">
                    Supabase email/password login
                  </p>
                  <p className="text-xs mt-2 text-gray-500">
                    Redirects to Dashboard on success
                  </p>
                </Card>
              </div>
              <div className="w-[48%]">
                <Card className="p-4 mb-4 bg-indigo-50 border-indigo-200 h-full">
                  <h3 className="font-medium">Signup Form</h3>
                  <p className="text-sm text-gray-600">
                    Create new Supabase account
                  </p>
                  <p className="text-xs mt-2 text-gray-500">
                    Creates profile and subscription
                  </p>
                </Card>
              </div>
            </div>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <Card className="w-full max-w-2xl p-4 mb-4 bg-green-50 border-green-200">
              <h3 className="font-medium">Dashboard</h3>
              <p className="text-sm text-gray-600">
                Main application interface
              </p>
            </Card>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Main Application Flow</h2>
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium mb-2">Dashboard</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Overview statistics</li>
                <li>Recent consultations</li>
                <li>Quick access to AI agents</li>
                <li>Navigation to other sections</li>
              </ul>
            </Card>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <h3 className="font-medium mb-2">AI Agents</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Browse available agents</li>
                <li>Filter by specialty</li>
                <li>Free vs Premium indicators</li>
                <li>Select agents for consultation</li>
              </ul>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <h3 className="font-medium mb-2">Consultations</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Start new consultation</li>
                <li>View consultation history</li>
                <li>Collaborative mode with multiple agents</li>
                <li>Solo mode with single agent</li>
              </ul>
            </Card>

            <Card className="p-4 bg-amber-50 border-amber-200">
              <h3 className="font-medium mb-2">Patient Records</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>View patient list</li>
                <li>Add new patients</li>
                <li>View patient details</li>
                <li>Update patient information</li>
              </ul>
            </Card>

            <Card className="p-4 bg-indigo-50 border-indigo-200">
              <h3 className="font-medium mb-2">Settings</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Account settings</li>
                <li>Subscription management</li>
                <li>Notification preferences</li>
                <li>Profile information</li>
              </ul>
            </Card>

            <Card className="p-4 bg-red-50 border-red-200">
              <h3 className="font-medium mb-2">Logout</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Sign out from Supabase</li>
                <li>Sign out from Simple Auth</li>
                <li>Redirect to home page</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Consultation Flow</h2>
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="flex flex-col items-center">
            <Card className="w-full max-w-2xl p-4 mb-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium">Start Consultation</h3>
              <p className="text-sm text-gray-600">
                User initiates a new consultation
              </p>
            </Card>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <Card className="w-full max-w-2xl p-4 mb-4 bg-purple-50 border-purple-200">
              <h3 className="font-medium">Select Patient</h3>
              <p className="text-sm text-gray-600">
                Choose existing patient or create new one
              </p>
            </Card>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <Card className="w-full max-w-2xl p-4 mb-4 bg-indigo-50 border-indigo-200">
              <h3 className="font-medium">Select AI Agents</h3>
              <p className="text-sm text-gray-600">
                Choose agents based on patient needs
              </p>
              <div className="mt-2 flex justify-between">
                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Solo Mode: Single agent
                </div>
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Collaborative Mode: Multiple agents
                </div>
              </div>
            </Card>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <Card className="w-full max-w-2xl p-4 mb-4 bg-amber-50 border-amber-200">
              <h3 className="font-medium">Enter Patient Information</h3>
              <p className="text-sm text-gray-600">
                Input symptoms, history, and other relevant data
              </p>
            </Card>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <Card className="w-full max-w-2xl p-4 mb-4 bg-green-50 border-green-200">
              <h3 className="font-medium">AI Analysis</h3>
              <p className="text-sm text-gray-600">
                Agents analyze patient data and provide insights
              </p>
            </Card>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <Card className="w-full max-w-2xl p-4 mb-4 bg-red-50 border-red-200">
              <h3 className="font-medium">Doctor-AI Interaction</h3>
              <p className="text-sm text-gray-600">
                Doctor asks questions and receives responses
              </p>
            </Card>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <Card className="w-full max-w-2xl p-4 mb-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium">Generate Summary</h3>
              <p className="text-sm text-gray-600">
                Create consultation summary with diagnosis and recommendations
              </p>
            </Card>
            <div className="h-8 w-0.5 bg-gray-300"></div>
            <Card className="w-full max-w-2xl p-4 mb-4 bg-purple-50 border-purple-200">
              <h3 className="font-medium">Save to Patient Record</h3>
              <p className="text-sm text-gray-600">
                Store consultation results in patient history
              </p>
            </Card>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Route Structure</h2>
        <div className="border rounded-lg p-6 bg-gray-50">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Path</th>
                <th className="border p-2 text-left">Component</th>
                <th className="border p-2 text-left">Protection</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">/</td>
                <td className="border p-2">Home</td>
                <td className="border p-2">None</td>
                <td className="border p-2">
                  Landing page with marketing content
                </td>
              </tr>
              <tr>
                <td className="border p-2">/login</td>
                <td className="border p-2">LoginForm</td>
                <td className="border p-2">None</td>
                <td className="border p-2">Supabase email/password login</td>
              </tr>
              <tr>
                <td className="border p-2">/signup</td>
                <td className="border p-2">SignUpForm</td>
                <td className="border p-2">None</td>
                <td className="border p-2">Create new Supabase account</td>
              </tr>
              <tr>
                <td className="border p-2">/dashboard</td>
                <td className="border p-2">Dashboard</td>
                <td className="border p-2">PrivateRoute</td>
                <td className="border p-2">Main dashboard overview</td>
              </tr>
              <tr>
                <td className="border p-2">/dashboard/agents</td>
                <td className="border p-2">Agents</td>
                <td className="border p-2">PrivateRoute</td>
                <td className="border p-2">Browse and select AI agents</td>
              </tr>
              <tr>
                <td className="border p-2">/dashboard/consultations</td>
                <td className="border p-2">Consultations</td>
                <td className="border p-2">PrivateRoute</td>
                <td className="border p-2">Manage patient consultations</td>
              </tr>
              <tr>
                <td className="border p-2">/dashboard/records</td>
                <td className="border p-2">PatientRecordsPage</td>
                <td className="border p-2">PrivateRoute</td>
                <td className="border p-2">View and manage patient records</td>
              </tr>
              <tr>
                <td className="border p-2">/success</td>
                <td className="border p-2">Success</td>
                <td className="border p-2">None</td>
                <td className="border p-2">Confirmation page after actions</td>
              </tr>
              <tr>
                <td className="border p-2">/tempobook/*</td>
                <td className="border p-2">null</td>
                <td className="border p-2">None</td>
                <td className="border p-2">Tempo storyboard routes</td>
              </tr>
              <tr>
                <td className="border p-2">*</td>
                <td className="border p-2">Navigate to /</td>
                <td className="border p-2">None</td>
                <td className="border p-2">Fallback for unknown routes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
