import { exec } from 'child_process';

export async function checkResourceInstallation(cmd: string): Promise<boolean> {
  return new Promise((resolve) => {
    exec(cmd, (error) => {
      resolve(!error);
    });
  });
}
