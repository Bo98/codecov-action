import * as github from '@actions/github';

import {
  buildCommitExec,
  buildGeneralExec,
  buildReportExec,
  buildUploadExec,
} from './buildExec';


const context = github.context;

test('general args', () => {
  const envs = {
    codecov_yml_path: 'dev/codecov.yml',
    url: 'https://codecov.enterprise.com',
    verbose: 't',
  };
  for (const env of Object.keys(envs)) {
    process.env['INPUT_' + env.toUpperCase()] = envs[env];
  }

  const {args, verbose} = buildGeneralExec();

  expect(args).toEqual(
      expect.arrayContaining([
        '--codecov-yml-path',
        'dev/codecov.yml',
        '--enterprise-url',
        'https://codecov.enterprise.com',
        '-v',
      ]));
  expect(verbose).toBeTruthy();
  for (const env of Object.keys(envs)) {
    delete process.env['INPUT_' + env.toUpperCase()];
  }
});


test('upload args using context', () => {
  const expectedArgs = [];
  const {uploadExecArgs, uploadCommand} = buildUploadExec();
  if (context.eventName == 'pull_request') {
    expectedArgs.push('-C', `${context.payload.pull_request.head.sha}`);
  }
  if (context.eventName == 'pull_request_target') {
    expectedArgs.push('-P', `${context.payload.number}`);
  }

  expect(uploadExecArgs).toEqual(expectedArgs);
  expect(uploadCommand).toEqual('do-upload');
});

test('upload args', () => {
  const envs = {
    'codecov_yml_path': 'dev/codecov.yml',
    'commit_parent': 'fakeparentcommit',
    'directory': 'coverage/',
    'disable_file_fixes': 'true',
    'disable_search': 'true',
    'dry_run': 'true',
    'env_vars': 'OS,PYTHON',
    'exclude': 'node_modules/',
    'fail_ci_if_error': 'true',
    'file': 'coverage.xml',
    'files': 'dir1/coverage.xml,dir2/coverage.xml',
    'flags': 'test,test2',
    'handle_no_reports_found': 'true',
    'job_code': '32',
    'name': 'codecov',
    'os': 'macos',
    'override_branch': 'thomasrockhu/test',
    'override_build': '1',
    'override_build_url': 'https://example.com/build/2',
    'override_commit': '9caabca5474b49de74ef5667deabaf74cdacc244',
    'override_pr': '2',
    'plugin': 'xcode',
    'plugins': 'pycoverage,compress-pycoverage',
    'report_code': 'testCode',
    'root_dir': 'root/',
    'slug': 'fakeOwner/fakeRepo',
    'token': 'd3859757-ab80-4664-924d-aef22fa7557b',
    'url': 'https://enterprise.example.com',
    'use_legacy_upload_endpoint': 'true',
    'verbose': 'true',
    'version': '0.1.2',
    'working-directory': 'src',
  };
  for (const env of Object.keys(envs)) {
    process.env['INPUT_' + env.toUpperCase()] = envs[env];
  }

  const {uploadExecArgs, uploadCommand} = buildUploadExec();
  const expectedArgs = [
    '--disable-file-fixes',
    '--disable-search',
    '-d',
    '-e',
    'OS,PYTHON',
    '--exclude',
    'node_modules/',
    '-Z',
    '-f',
    'coverage.xml',
    '-f',
    'dir1/coverage.xml',
    '-f',
    'dir2/coverage.xml',
    '-F',
    'test',
    '-F',
    'test2',
    '--handle-no-reports-found',
    '--job-code',
    '32',
    '-n',
    'codecov',
    '-B',
    'thomasrockhu/test',
    '-b',
    '1',
    '--build-url',
    'https://example.com/build/2',
    '-C',
    '9caabca5474b49de74ef5667deabaf74cdacc244',
    '-P',
    '2',
    '--plugin',
    'xcode',
    '--plugin',
    'pycoverage',
    '--plugin',
    'compress-pycoverage',
    '--report-code',
    'testCode',
    '--network-root-folder',
    'root/',
    '-s',
    'coverage/',
    '-r',
    'fakeOwner/fakeRepo',
    '--legacy',
  ];

  expect(uploadExecArgs).toEqual(expectedArgs);
  expect(uploadCommand).toEqual('do-upload');
  for (const env of Object.keys(envs)) {
    delete process.env['INPUT_' + env.toUpperCase()];
  }
});


test('report args', () => {
  const envs = {
    override_commit: '9caabca5474b49de74ef5667deabaf74cdacc244',
    override_pr: 'fakePR',
    slug: 'fakeOwner/fakeRepo',
    token: 'd3859757-ab80-4664-924d-aef22fa7557b',
    fail_ci_if_error: 'true',
  };
  for (const env of Object.keys(envs)) {
    process.env['INPUT_' + env.toUpperCase()] = envs[env];
  }

  const {reportExecArgs, reportCommand} = buildReportExec();

  const expectedArgs = [
    '-C',
    '9caabca5474b49de74ef5667deabaf74cdacc244',
    '-P',
    'fakePR',
    '--slug',
    'fakeOwner/fakeRepo',
    '-Z',
  ];

  expect(reportExecArgs).toEqual(expectedArgs);
  expect(reportCommand).toEqual('create-report');
  for (const env of Object.keys(envs)) {
    delete process.env['INPUT_' + env.toUpperCase()];
  }
});


test('report args using context', () => {
  const envs = {
    token: 'd3859757-ab80-4664-924d-aef22fa7557b',
  };
  for (const env of Object.keys(envs)) {
    process.env['INPUT_' + env.toUpperCase()] = envs[env];
  }
  const expectedArgs : string[] = [];
  if (context.eventName == 'pull_request') {
    expectedArgs.push('-C', `${context.payload.pull_request.head.sha}`);
  }

  const {reportExecArgs, reportCommand} = buildReportExec();

  expect(reportExecArgs).toEqual(expectedArgs);
  expect(reportCommand).toEqual('create-report');
  for (const env of Object.keys(envs)) {
    delete process.env['INPUT_' + env.toUpperCase()];
  }
});


test('commit args', () => {
  const envs = {
    commit_parent: '83231650328f11695dfb754ca0f540516f188d27',
    override_branch: 'thomasrockhu/test',
    override_commit: '9caabca5474b49de74ef5667deabaf74cdacc244',
    override_pr: '2',
    slug: 'fakeOwner/fakeRepo',
    token: 'd3859757-ab80-4664-924d-aef22fa7557b',
    fail_ci_if_error: 'true',
  };
  for (const env of Object.keys(envs)) {
    process.env['INPUT_' + env.toUpperCase()] = envs[env];
  }

  const {commitExecArgs, commitCommand} = buildCommitExec();
  const expectedArgs = [
    '--parent-sha',
    '83231650328f11695dfb754ca0f540516f188d27',
    '-B',
    'thomasrockhu/test',
    '-C',
    '9caabca5474b49de74ef5667deabaf74cdacc244',
    '--pr',
    '2',
    '--slug',
    'fakeOwner/fakeRepo',
    '-Z',
  ];

  expect(commitExecArgs).toEqual(expectedArgs);
  expect(commitCommand).toEqual('create-commit');
  for (const env of Object.keys(envs)) {
    delete process.env['INPUT_' + env.toUpperCase()];
  }
});

test('commit args using context', () => {
  const expectedArgs :string[] = [];

  const {commitExecArgs, commitCommand} = buildCommitExec();
  if (context.eventName == 'pull_request') {
    expectedArgs.push('-C', `${context.payload.pull_request.head.sha}`);
  }
  if (context.eventName == 'pull_request_target') {
    expectedArgs.push('-P', `${context.payload.number}`);
  }

  expect(commitExecArgs).toEqual(expectedArgs);
  expect(commitCommand).toEqual('create-commit');
});
