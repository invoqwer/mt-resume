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

// `config.yaml` - project config
// fields:
// - `resumeVersion`
// - `resumeLayout`
// - `resumeOutputName`
// - `distPath`
// - `port`
const projectConfigPath = path.join(__root, 'config.yaml');
const projectConfig = async () => {
  const pcfg = await parseYaml(projectConfigPath);
  pcfg.layoutPath = path.join(__root, 'layouts', pcfg.resumeLayout);
  const resumeYamlPath = path.join(
      __root, 'resume', `${pcfg.resumeVersion}-${pcfg.resumeLayout}.yaml`);
  pcfg.resumeYaml = await parseYaml(resumeYamlPath);
  pcfg.distPath = path.join(__root, pcfg.distPath);
  log('Project config:');
  log(pcfg);
  return pcfg;
};

// resume config
// fields:
// - removeClass
const resumeConfig = async (pcfg) => {
  const resumeConfigPath = path.join(pcfg.layoutPath, 'config.yaml');
  const rcfg = await parseYaml(resumeConfigPath);
  log('Resume config:');
  log(rcfg);
  return rcfg;
};

export {
  projectConfig as projectConfig,
  resumeConfig as resumeConfig,
};
