import {readFile} from 'fs/promises';
import yaml from 'js-yaml';
import path from 'path';

const log = console.log;
const parseYaml = async (filePath) => {
  try {
    const f = await readFile(filePath, 'utf-8');
    return yaml.load(f);
  } catch (err) {
    log(err);
    return {};
  }
};

const __root = path.resolve();

const projectConfigPath = path.join(__root, 'config.yaml');
const projectConfig = async () => {
  const pcfg = await parseYaml(projectConfigPath);
  pcfg.layoutPath = path.join(__root, 'layouts', pcfg.resumeLayout);
  const resumeContentPath = path.join(
      __root, 'content', `${pcfg.resumeVersion}-${pcfg.resumeLayout}.yaml`);
  pcfg.resumeContent = await parseYaml(resumeContentPath);
  pcfg.distPath = path.join(__root, pcfg.distPath);
  log('Project config:');
  log(pcfg);
  return pcfg;
};

const resumeConfig = async (pcfg) => {
  const resumeConfigPath = path.join(pcfg.layoutPath, 'config.yaml');
  const rcfg = await parseYaml(resumeConfigPath);
  log('Resume config:');
  log(rcfg);
  return rcfg;
};

export {projectConfig, resumeConfig};
