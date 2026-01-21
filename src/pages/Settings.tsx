import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  return (
    <AppLayout title="Settings">
      <div className="max-w-2xl space-y-8">
        {/* Profile Section */}
        <section className="bg-card rounded-xl border border-border shadow-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Alex" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Morgan" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="alex@company.com" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-card rounded-xl border border-border shadow-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email updates about task changes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Due Date Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified before task deadlines</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Activity Digest</p>
                <p className="text-sm text-muted-foreground">Weekly summary of project activity</p>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-card rounded-xl border border-destructive/30 shadow-card p-6">
          <h2 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Settings;
