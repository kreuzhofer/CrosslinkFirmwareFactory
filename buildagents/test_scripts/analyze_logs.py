def extract_flash_info(logfile):
    flash_percent_used = flash_bytes_used = flash_bytes_max = status = error_msg = None

    with open(logfile, 'r') as file:
        lines = file.readlines()
        for line in lines:
            if "Flash:" in line:
                # Extract the percentage used
                flash_percent_used = line.split(']')[1].split('%')[0].strip()

                # Extract the absolute number of bytes used and the maximum number of bytes
                flash_info = line.split('(')[1].split(')')[0]
                flash_bytes_used, flash_bytes_max = flash_info.split('bytes from')

            elif "[SUCCESS]" in line:
                status = 'SUCCESS'
            
            elif "[FAILED]" in line:
                status = 'FAILED'
        
        if status == 'FAILED':
            # Return the last error message in the log
            for line in reversed(lines):
                if 'Error:' in line:
                    error_msg = line.strip()
                    break

    if flash_bytes_used is not None:
        flash_bytes_used = flash_bytes_used.strip("used ").strip()
    if flash_bytes_max is not None:
        flash_bytes_max = flash_bytes_max.strip(" bytes").strip()

    return flash_percent_used, flash_bytes_used, flash_bytes_max, status, error_msg

# Use the function
flash_percent_used, flash_bytes_used, flash_bytes_max, status, error_msg = extract_flash_info('logfile_success.txt')
print(f"Flash used: {flash_percent_used}%")
print(f"Absolute number of bytes used: {flash_bytes_used} bytes")
print(f"Maximum number of bytes: {flash_bytes_max} bytes")
print(f"Build status: {status}")
if status == 'FAILED':
    print(f"Error message: {error_msg}")

flash_percent_used, flash_bytes_used, flash_bytes_max, status, error_msg = extract_flash_info('logfile_failed.txt')
print(f"Flash used: {flash_percent_used}%")
print(f"Absolute number of bytes used: {flash_bytes_used} bytes")
print(f"Maximum number of bytes: {flash_bytes_max} bytes")
print(f"Build status: {status}")
if status == 'FAILED':
    print(f"Error message: {error_msg}")

flash_percent_used, flash_bytes_used, flash_bytes_max, status, error_msg = extract_flash_info('logfile_3.txt')
print(f"Flash used: {flash_percent_used}%")
print(f"Absolute number of bytes used: {flash_bytes_used} bytes")
print(f"Maximum number of bytes: {flash_bytes_max} bytes")
print(f"Build status: {status}")
if status == 'FAILED':
    print(f"Error message: {error_msg}")
