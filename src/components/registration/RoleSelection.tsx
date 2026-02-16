import { motion } from 'framer-motion';
import { UserRole, roleLabels, roleDescriptions, roleIcons, useRegistrationStore } from '@/stores/registrationStore';

const roles: UserRole[] = ['gaushala', 'ngo', 'volunteer', 'donor', 'influencer', 'vendor'];

const RoleSelection = () => {
  const setSelectedRole = useRegistrationStore((s) => s.setSelectedRole);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-3">
          Join the <span className="text-gradient-saffron">GauBook</span> Community
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Select your role to get started with registration
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {roles.map((role, index) => (
          <motion.button
            key={role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => setSelectedRole(role)}
            className="group relative bg-card border border-border rounded-xl p-6 text-left hover:border-primary/50 hover:shadow-warm transition-all duration-300 cursor-pointer"
          >
            <div className="text-4xl mb-3">{roleIcons[role]}</div>
            <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
              {roleLabels[role]}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              {roleDescriptions[role]}
            </p>
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-all">
              →
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;
